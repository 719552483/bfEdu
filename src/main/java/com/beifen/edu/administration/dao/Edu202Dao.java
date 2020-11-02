package com.beifen.edu.administration.dao;

import java.util.List;

import com.beifen.edu.administration.PO.StudentInPointPO;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu202;

import javax.transaction.Transactional;

@Configuration
public interface Edu202Dao extends JpaRepository<Edu202, Long>, JpaSpecificationExecutor<Edu202> {

	// 验证是否有排课表正在使用课节Id
	@Query(value = "select * from edu202 e where e.kjid like %?1%", nativeQuery = true)
	List<Edu202> verifyKj(String kjId);

	//根据ID查询排课信息
	@Query(value = "select * from edu202 e where e.Edu202_ID = ?1", nativeQuery = true)
	Edu202 findEdu202ById(String edu202Id);

	@Query(value = "select e.Edu202_ID from Edu202 e where e.pointid = ?1", nativeQuery = true)
	List<String> findEdu202IdsByEdu501Id(String edu501Id);

	@Query(value = "select e.Edu202_ID from Edu202 e where e.Edu201_ID in ?1", nativeQuery = true)
    List<String> findEdu202ByEdu201Ids(List<String> deleteArray);

	@Query(value = "select e.Edu202_ID from Edu202 e where e.Edu201_ID = ?1", nativeQuery = true)
    List<String> findEdu202ByEdu201Ids(String edu201Id);

	@Query(value = "select new com.beifen.edu.administration.PO.StudentInPointPO(b.skddid,b.skddmc,sum(c.zxrs)) from Edu201 a, Edu202 b, Edu204 d,Edu300 c " +
			"where a.edu201_ID = b.edu201_ID " +
			"and d.edu201_ID = a.edu201_ID " +
			"and c.edu300_ID = d.edu300_ID " +
			"and b.skddid is not null " +
			"and b.skddid <> '57250' " +
			"group by b.skddid,b.skddmc " +
			"order by b.skddid ")
	List<StudentInPointPO> getStudentsInLocal();
}
